import { test as base, expect, type APIRequestContext, type Page } from "@playwright/test";
import { Dialect, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type E2EUser = {
  nickname: string;
  email: string;
  password: string;
  dialect: Dialect;
};

type AddWordDraft = {
  swissGerman: string;
  german: string;
  dialect?: Dialect;
};

type AddInterpretationDraft = {
  explanation: string;
  example?: string;
};

function resolveTestDatabaseUrl() {
  if (process.env.DATABASE_TEST_URL) {
    return process.env.DATABASE_TEST_URL;
  }

  const user = process.env.POSTGRES_TEST_USER || process.env.POSTGRES_USER || "test_user";
  const password =
    process.env.POSTGRES_TEST_PASSWORD || process.env.POSTGRES_PASSWORD || "test_password";
  const db = process.env.POSTGRES_TEST_DB || "helvetikon_test";

  return `postgresql://${user}:${password}@localhost:5433/${db}?schema=public`;
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: resolveTestDatabaseUrl(),
    },
  },
});

const EMAIL_VERIFICATION_SECRET =
  process.env.EMAIL_VERIFICATION_SECRET || "email-verification-secret";

function uniqueSuffix() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function submitRegistration(page: Page, user: E2EUser) {
  const response = await page.request.post("/api/auth/register", {
    data: {
      nickname: user.nickname,
      email: user.email,
      password: user.password,
      dialect: user.dialect,
    },
  });
  expect(response.status()).toBe(201);
}

async function createVerificationToken(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, username: true },
  });

  if (!user) {
    throw new Error(`Expected registered user for ${email}`);
  }

  return jwt.sign(user, EMAIL_VERIFICATION_SECRET);
}

async function verifyUserInBrowser(page: Page, email: string) {
  const token = await createVerificationToken(email);
  await page.goto(`/verifizieren?token=${encodeURIComponent(token)}`);
  await expect(page).toHaveURL(/\/$/);
}

async function loginViaUi(page: Page, email: string, password: string) {
  let response = await page.request.post("/api/auth/login", {
    data: { email, password },
  });

  if (response.status() === 500) {
    await page.waitForTimeout(1100);
    response = await page.request.post("/api/auth/login", {
      data: { email, password },
    });
  }

  expect(response.status()).toBe(200);
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
}

async function logoutViaUi(page: Page) {
  const response = await page.request.post("/api/auth/logout");
  expect(response.status()).toBe(200);
  await page.goto("/");
}

async function addWordViaUi(page: Page, draft: AddWordDraft) {
  const response = await page.request.post("/api/words", {
    data: {
      swissGerman: draft.swissGerman,
      german: draft.german,
      spellings: [draft.swissGerman, `${draft.swissGerman}x`],
      dialect: draft.dialect || Dialect.BERN,
    },
  });
  expect(response.status()).toBe(200);

  await page.goto(`/bern/${draft.swissGerman}`);
  await expect(page.getByRole("heading", { name: draft.swissGerman })).toBeVisible();
}

async function addInterpretationViaUi(
  page: Page,
  wordId: number,
  wordPath: string,
  draft: AddInterpretationDraft
) {
  const response = await page.request.post(`/api/words/${wordId}/interpretations`, {
    data: [
      {
        explanation: draft.explanation,
        examples: draft.example ? [draft.example] : [],
      },
    ],
  });
  expect(response.status()).toBe(200);
  await page.goto(wordPath);
  await expect(page.getByText(draft.explanation)).toBeVisible();
}

async function findInterpretationIdByMeaning(explanation: string) {
  const record = await prisma.meaning.findFirst({
    where: { explanation },
    select: { interpretationId: true },
    orderBy: { id: "desc" },
  });

  if (!record) {
    throw new Error(`Missing interpretation for explanation: ${explanation}`);
  }

  return record.interpretationId;
}

async function findWordIdBySwissGerman(swissGerman: string) {
  const record = await prisma.word.findFirst({
    where: { swissGerman, dialect: Dialect.BERN },
    select: { id: true },
    orderBy: { id: "desc" },
  });

  if (!record) {
    throw new Error(`Missing word for swissGerman: ${swissGerman}`);
  }

  return record.id;
}

async function registerAndVerifyViaApi(request: APIRequestContext, user: E2EUser) {
  const registerResponse = await request.post("/api/auth/register", {
    data: {
      nickname: user.nickname,
      email: user.email,
      password: user.password,
      dialect: user.dialect,
    },
  });

  expect(registerResponse.status()).toBe(201);

  const token = await createVerificationToken(user.email);
  const verifyResponse = await request.get(
    `/api/auth/verify?token=${encodeURIComponent(token)}`
  );

  expect(verifyResponse.status()).toBe(201);
}

async function createVerifiedUserInDb(user: E2EUser) {
  const passwordHash = await bcrypt.hash(user.password, 10);

  await prisma.user.create({
    data: {
      username: user.nickname,
      email: user.email,
      password: passwordHash,
      preferredDialect: user.dialect,
      verified: true,
    },
  });
}

export const seededOwnerUser = {
  email: "owner.test@helvetikon.local",
  password: "TestPass123!",
};

export const test = base.extend<{
  e2e: {
    uniqueUser: (prefix?: string) => E2EUser;
    submitRegistration: (page: Page, user: E2EUser) => Promise<void>;
    verifyUserInBrowser: (page: Page, email: string) => Promise<void>;
    loginViaUi: (page: Page, email: string, password: string) => Promise<void>;
    logoutViaUi: (page: Page) => Promise<void>;
    addWordViaUi: (page: Page, draft: AddWordDraft) => Promise<void>;
    addInterpretationViaUi: (
      page: Page,
      wordId: number,
      wordPath: string,
      draft: AddInterpretationDraft
    ) => Promise<void>;
    findInterpretationIdByMeaning: (explanation: string) => Promise<number>;
    findWordIdBySwissGerman: (swissGerman: string) => Promise<number>;
    registerAndVerifyViaApi: (
      request: APIRequestContext,
      user: E2EUser
    ) => Promise<void>;
    createVerifiedUserInDb: (user: E2EUser) => Promise<void>;
  };
}>({
  e2e: async ({}, use) => {
    await use({
      uniqueUser(prefix = "e2e") {
        const suffix = uniqueSuffix();
        const base = `${prefix}${suffix}`.slice(0, 16);

        return {
          nickname: base,
          email: `${base}@helvetikon.local`,
          password: "TestPass123!",
          dialect: Dialect.BERN,
        };
      },
      submitRegistration,
      verifyUserInBrowser,
      loginViaUi,
      logoutViaUi,
      addWordViaUi,
      addInterpretationViaUi,
      findInterpretationIdByMeaning,
      findWordIdBySwissGerman,
      registerAndVerifyViaApi,
      createVerifiedUserInDb,
    });
  },
});

export async function closeE2EFixtures() {
  await prisma.$disconnect();
}

export { expect };
