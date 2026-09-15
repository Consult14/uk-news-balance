const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 5000;

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validationError(message: string): Response {
  return Response.json({ error: message }, { status: 400 });
}

export async function POST(request: Request): Promise<Response> {
  let payload: ContactPayload;

  try {
    payload = await request.json();
  } catch {
    return validationError("Invalid request body.");
  }

  if (typeof payload.website === "string" && payload.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  if (typeof payload.name !== "string" || !payload.name.trim()) {
    return validationError("Name is required.");
  }

  if (typeof payload.email !== "string" || !payload.email.trim()) {
    return validationError("Email is required.");
  }

  if (typeof payload.message !== "string" || !payload.message.trim()) {
    return validationError("Message is required.");
  }

  const name = payload.name.trim();
  const email = payload.email.trim();
  const message = payload.message.trim();

  if (name.length > MAX_NAME_LENGTH) {
    return validationError(`Name must be ${MAX_NAME_LENGTH} characters or fewer.`);
  }

  if (email.length > MAX_EMAIL_LENGTH || !isValidEmail(email)) {
    return validationError("Please enter a valid email address.");
  }

  if (message.length < MIN_MESSAGE_LENGTH) {
    return validationError(
      `Message must be at least ${MIN_MESSAGE_LENGTH} characters.`,
    );
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return validationError(
      `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`,
    );
  }

  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("SLACK_WEBHOOK_URL is not configured.");
    return Response.json(
      { error: "Contact form is not configured yet. Please try again later." },
      { status: 503 },
    );
  }

  const slackResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `New contact from ${name} (${email})`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "New contact form submission",
          },
        },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*Name:*\n${name}` },
            { type: "mrkdwn", text: `*Email:*\n${email}` },
          ],
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Message:*\n${message}`,
          },
        },
      ],
    }),
  });

  if (!slackResponse.ok) {
    console.error("Slack webhook failed:", slackResponse.status);
    return Response.json(
      { error: "Unable to send your message. Please try again later." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
