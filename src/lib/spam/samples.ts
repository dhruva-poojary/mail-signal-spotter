export interface SampleEmail {
  id: string;
  kind: "spam" | "ham";
  title: string;
  from: string;
  subject: string;
  body: string;
}

export const SAMPLE_EMAILS: SampleEmail[] = [
  {
    id: "lottery",
    kind: "spam",
    title: "Lottery winner",
    from: "claims@intl-lotto-prize.biz",
    subject: "You WON $850,000!!!",
    body: "CONGRATULATIONS!!! Your email has been selected as the lucky WINNER of $850,000 in our international award draw. To claim your cash prize, reply now with your full name, bank account and phone number. This offer expires in 24 hours. Click here: http://claim-prize-now.biz",
  },
  {
    id: "phishing",
    kind: "spam",
    title: "Account suspended",
    from: "security@paypa1-support.com",
    subject: "Urgent: verify your account",
    body: "Dear Customer, we noticed suspicious activity and your account has been temporarily suspended. To restore access, verify your identity and update your billing details immediately using the secure link below. Failure to verify within 12 hours will result in permanent closure. www.secure-verify-login.com",
  },
  {
    id: "offer",
    kind: "spam",
    title: "Free gift offer",
    from: "deals@mega-offers.net",
    subject: "FREE iPhone – limited time",
    body: "Limited time offer! Get a FREE iPhone 15 or £500 cash voucher. Text WIN to 80082 now to claim your free gift. Only 3 left! Guaranteed winner, no purchase needed. Call 09061743810 to receive your reward today.",
  },
  {
    id: "meeting",
    kind: "ham",
    title: "Project meeting",
    from: "ananya.sharma@college.edu",
    subject: "Final year project review on Monday",
    body: "Hi team, just a reminder that our final year project review with Prof. Kumar is on Monday at 11 AM in Lab 3. Please bring the updated report, the presentation slides and a working demo on your laptop. Let me know if you have any questions before then. Thanks, Ananya",
  },
  {
    id: "friend",
    kind: "ham",
    title: "Weekend plans",
    from: "rohan.m@gmail.com",
    subject: "Dinner this Saturday?",
    body: "Hey, how have you been? A few of us are planning to go out for dinner this Saturday evening near the station. Would you like to join? Let me know by Friday so I can book a table for everyone. See you soon!",
  },
  {
    id: "work",
    kind: "ham",
    title: "Code review",
    from: "dev-lead@company.com",
    subject: "Review of login module",
    body: "Hello, I have gone through your pull request for the login module. The changes look good overall. Could you please add a couple of unit tests for the password reset flow and update the documentation? After that we can merge it into the main branch. Thanks for the quick fix.",
  },
];
