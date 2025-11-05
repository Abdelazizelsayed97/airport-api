# TODO: Check Notification Functionality with Firebase and FCM, and Send Email with Queue

## Tasks

- [x] Update EmailService to inject QueueService and replace direct SendGrid sends with queue job additions
- [x] Modify EmailWorker to inject EmailService and implement job processing for 'send-verification' and 'status-notification'
- [x] Uncomment Logger in NotificationService and add logging for FCM sends

## Followup Steps

- [ ] Test the queue by running the app and triggering email jobs
- [ ] Verify FCM notifications by sending a test notification and checking logs
