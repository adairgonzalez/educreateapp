// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//   'http://127.0.0.1:54321',
//   'your-service-role-key'
// );

// async function setupEmailTemplates() {
//   const { error } = await supabase.auth.admin.updateConfig({
//     email_templates: {
//       invite: {
//         subject: 'Invite to join eduCreate',
//         content: 'You have been invited to join eduCreate...',
//       },
//       confirmation: {
//         subject: 'Confirm your email',
//         content: 'Please confirm your email by clicking the link below...',
//       },
//       recovery: {
//         subject: 'Reset your password',
//         content: 'Click the link below to reset your password...',
//       },
//       magic_link: {
//         subject: 'Your magic link',
//         content: 'Click the link below to sign in...',
//       },
//     },
//   });

//   if (error) {
//     console.error('Error setting up email templates:', error);
//   } else {
//     console.log('Email templates set up successfully');
//   }
// }

// setupEmailTemplates();
