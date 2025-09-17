import { socketHelper } from './socketHelper';
import { InvitationDto } from '../../types/InvitationDto';

const NOTIFICATIONS_TOPIC = '/user/queue/invitations';

export const subscribeToNotifications = (
  callback: (invitation: InvitationDto) => void
) => {
  if (!callback) return;

  const unsubscribe = socketHelper.subscribe(NOTIFICATIONS_TOPIC, (msg) => {
    alert("Message received in notifications.ts");
    try {
      const invitation: InvitationDto = JSON.parse(msg.body); 
      alert("Received invitation: " + msg.body);
      callback(invitation);
    } catch (err) {
      console.error("Error parsing invitation:", err, msg);
    }
  });

  return unsubscribe;
};
