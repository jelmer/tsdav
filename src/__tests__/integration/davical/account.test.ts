import { createAccount, fetchHomeUrl, fetchPrincipalUrl, serviceDiscovery } from '../../../account';
import { getBasicAuthHeaders } from '../../../util/authHelpers';

let authHeaders: {
  authorization?: string;
};

beforeAll(async () => {
  authHeaders = getBasicAuthHeaders({
    username: process.env.CREDENTIAL_DAVICAL_USERNAME,
    password: process.env.CREDENTIAL_DAVICAL_PASSWORD,
  });
});

test('serviceDiscovery should be able to discover the caldav service', async () => {
  const url = await serviceDiscovery({
    account: {
      serverUrl: `${process.env.CREDENTIAL_DAVICAL_SERVER_URL}`,
      accountType: 'caldav',
    },
    headers: authHeaders,
  });
  expect(url).toEqual(`${process.env.CREDENTIAL_DAVICAL_SERVER_URL}`);
});

test('fetchPrincipalUrl should be able to fetch the url of principal collection', async () => {
  const url = await fetchPrincipalUrl({
    account: {
      serverUrl: `${process.env.CREDENTIAL_DAVICAL_SERVER_URL}`,
      rootUrl: `${process.env.CREDENTIAL_DAVICAL_SERVER_URL}`,
      accountType: 'caldav',
    },
    headers: authHeaders,
  });
  expect(url).toMatch(/http:\/\/.+\/caldav\.php\/.+/);
});

test('fetchHomeUrl should be able to fetch the url of home set', async () => {
  const principalUrl = await fetchPrincipalUrl({
    account: {
      serverUrl: `${process.env.CREDENTIAL_DAVICAL_SERVER_URL}`,
      rootUrl: `${process.env.CREDENTIAL_DAVICAL_SERVER_URL}`,
      accountType: 'caldav',
    },
    headers: authHeaders,
  });
  const url = await fetchHomeUrl({
    account: {
      principalUrl,
      serverUrl: `${process.env.CREDENTIAL_DAVICAL_SERVER_URL}`,
      rootUrl: `${process.env.CREDENTIAL_DAVICAL_SERVER_URL}`,
      accountType: 'caldav',
    },
    headers: authHeaders,
  });
  expect(url).toMatch(/http:\/\/.+\/caldav\.php\/.+\//);
});

test('createAccount should be able to create account', async () => {
  const account = await createAccount({
    account: {
      serverUrl: `${process.env.CREDENTIAL_DAVICAL_SERVER_URL}`,
      accountType: 'caldav',
    },
    headers: authHeaders,
  });
  expect(account.rootUrl).toEqual(`${process.env.CREDENTIAL_DAVICAL_SERVER_URL}`);
  expect(account.principalUrl).toMatch(/http:\/\/.+\/caldav\.php\/.+\//);
  expect(account.homeUrl).toMatch(/http:\/\/.+\/caldav\.php\/.+\//);
});
