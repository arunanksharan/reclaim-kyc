import { Reclaim } from '@reclaimprotocol/js-sdk';
import { v4 as uuidv4 } from 'uuid';

const APP_ID = process.env.APP_ID || '';
const APP_SECRET = process.env.APP_SECRET || '';

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const appId = searchParams.get('appId');
  const sessionId = uuidv4(); // we recommend using uuid.v4()

  const providerIds = [
    '5e1302ca-a3dd-4ef8-bc25-24fcc97dc800', // Aadhaar Card Date of Birth
    '5e1302ca-a3dd-4ef8-bc25-24fcc97dc801', // Aadhaar Card Date of Birth v2
  ];
  const providerId = providerIds[0];

  const reclaimClient = new Reclaim.ProofRequest(APP_ID, { sessionId });
  await reclaimClient.buildProofRequest(providerId);

  reclaimClient.setSignature(
    await reclaimClient.generateSignature(
      APP_SECRET //TODO : replace with your APP_SECRET
    )
  );
  const { requestUrl, statusUrl } =
    await reclaimClient.createVerificationRequest();

  return Response.json({ 'request-proof': { requestUrl, statusUrl } });
}

export async function POST(request: Request) {
  const sessionId = uuidv4(); // we recommend using uuid.v4()
  const { appId, providerId } = await request.json();
  const reclaimClient = new Reclaim.ProofRequest(appId, { sessionId });
  await reclaimClient.buildProofRequest(providerId);

  reclaimClient.setSignature(
    await reclaimClient.generateSignature(
      APP_SECRET //TODO : Update APP_SECRET with your app secret
    )
  );

  const { requestUrl: signedUrl, statusUrl } =
    await reclaimClient.createVerificationRequest();

  return Response.json({ signedUrl, statusUrl });
}
