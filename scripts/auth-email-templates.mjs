function layout({ eyebrow, title, body, actionLabel, actionUrl, code, warning }) {
  const action = actionLabel && actionUrl
    ? `<p style="margin:28px 0"><a href="${actionUrl}" style="display:inline-block;background:#0a353c;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:2px">${actionLabel}</a></p>`
    : "";
  const token = code
    ? `<div style="margin:24px 0;padding:18px;background:#edf5f3;color:#0a353c;font-size:30px;font-weight:800;letter-spacing:8px;text-align:center">${code}</div>`
    : "";
  return `<!doctype html><html><body style="margin:0;background:#f3f4ef;color:#0a3037;font-family:Arial,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4ef;padding:28px 12px"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff"><tr><td style="padding:25px 32px;background:#0a353c;color:#ffffff;font-size:25px;font-weight:800;letter-spacing:-1px">washd<span style="color:#dfb95f">.</span></td></tr><tr><td style="padding:38px 32px"><p style="margin:0 0 12px;color:#b07d2e;font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase">${eyebrow}</p><h1 style="margin:0 0 18px;color:#0a3037;font-size:31px;line-height:1.15">${title}</h1><div style="color:#61777b;font-size:16px;line-height:1.7">${body}</div>${token}${action}${warning ? `<p style="margin:28px 0 0;padding-top:20px;border-top:1px solid #e2e8e6;color:#815a27;font-size:14px;line-height:1.6">${warning}</p>` : ""}</td></tr><tr><td style="padding:22px 32px;background:#edf2f0;color:#64797d;font-size:12px;line-height:1.6">Washd · Laundry, handled.<br>Questions? Contact <a href="mailto:washdmy@gmail.com" style="color:#0a535a">washdmy@gmail.com</a> or WhatsApp 017-649 4749.</td></tr></table></td></tr></table></body></html>`;
}

export const authEmailConfiguration = {
  mailer_subjects_confirmation: "Confirm your Washd account",
  mailer_templates_confirmation_content: layout({ eyebrow: "Welcome to Washd", title: "Confirm your email address.", body: "<p>Confirm this address to finish creating your Washd member account and securely manage your laundry plan.</p>", actionLabel: "Confirm my account", actionUrl: "{{ .ConfirmationURL }}", warning: "If you did not create a Washd account, you can ignore this email." }),
  mailer_subjects_recovery: "Reset your Washd password",
  mailer_templates_recovery_content: layout({ eyebrow: "Account recovery", title: "Choose a new password.", body: "<p>We received a request to reset the password for {{ .Email }}. Use the secure link below to continue.</p>", actionLabel: "Reset my password", actionUrl: "{{ .ConfirmationURL }}", warning: "If you did not request this, do not open the link. Contact Washd if you are concerned about your account." }),
  mailer_subjects_invite: "You’re invited to Washd",
  mailer_templates_invite_content: layout({ eyebrow: "Member invitation", title: "Your Washd account is ready to begin.", body: "<p>Accept this invitation to set your account credentials and view your membership.</p>", actionLabel: "Accept invitation", actionUrl: "{{ .ConfirmationURL }}", warning: "This invitation is intended only for {{ .Email }}." }),
  mailer_subjects_magic_link: "Your secure Washd sign-in link",
  mailer_templates_magic_link_content: layout({ eyebrow: "Secure sign-in", title: "Sign in to your Washd account.", body: "<p>Use this one-time link to access your account. It expires shortly and should not be forwarded.</p>", actionLabel: "Sign in securely", actionUrl: "{{ .ConfirmationURL }}", warning: "If you did not request this link, you can ignore this email." }),
  mailer_subjects_email_change: "Confirm your new Washd email address",
  mailer_templates_email_change_content: layout({ eyebrow: "Account update", title: "Confirm your new email.", body: "<p>You asked to change your Washd account email to {{ .NewEmail }}.</p>", actionLabel: "Confirm new email", actionUrl: "{{ .ConfirmationURL }}", warning: "If you did not request this change, do not confirm it and contact Washd immediately." }),
  mailer_subjects_reauthentication: "{{ .Token }} is your Washd verification code",
  mailer_templates_reauthentication_content: layout({ eyebrow: "Identity check", title: "Verify this sensitive action.", body: "<p>Enter the code below in Washd. It expires shortly and must never be shared with another person.</p>", code: "{{ .Token }}", warning: "Washd will never ask you to send this code by email, telephone or WhatsApp." }),
  mailer_notifications_password_changed_enabled: true,
  mailer_subjects_password_changed_notification: "Your Washd password was changed",
  mailer_templates_password_changed_notification_content: layout({ eyebrow: "Security notice", title: "Your password was changed.", body: "<p>The password for {{ .Email }} was changed recently.</p>", warning: "If this was not you, reset your password immediately and contact Washd." }),
  mailer_notifications_email_changed_enabled: true,
  mailer_subjects_email_changed_notification: "Your Washd email address was changed",
  mailer_templates_email_changed_notification_content: layout({ eyebrow: "Security notice", title: "Your account email changed.", body: "<p>Your Washd account email was changed from {{ .OldEmail }} to {{ .Email }}.</p>", warning: "If this was not you, contact Washd immediately." }),
  mailer_notifications_mfa_factor_enrolled_enabled: true,
  mailer_subjects_mfa_factor_enrolled_notification: "Authenticator added to your Washd account",
  mailer_templates_mfa_factor_enrolled_notification_content: layout({ eyebrow: "Security notice", title: "A verification method was added.", body: "<p>A new {{ .FactorType }} verification method was added to your Washd account.</p>", warning: "If this was not you, contact Washd immediately." }),
  mailer_notifications_mfa_factor_unenrolled_enabled: true,
  mailer_subjects_mfa_factor_unenrolled_notification: "Authenticator removed from your Washd account",
  mailer_templates_mfa_factor_unenrolled_notification_content: layout({ eyebrow: "Security notice", title: "A verification method was removed.", body: "<p>A {{ .FactorType }} verification method was removed from your Washd account.</p>", warning: "If this was not you, contact Washd immediately." }),
};
