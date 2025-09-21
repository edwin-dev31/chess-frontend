import { socketHelper } from '@/lib/helpers/socketHelper';
import { InvitationDto } from '@/lib/types/InvitationDto';

const NOTIFICATIONS_TOPIC = '/user/queue/invitations';

export const subscribeToNotifications = (
  callback: (invitation: InvitationDto) => void
) => {
  if (!callback) return;

  const unsubscribe = socketHelper.subscribe(NOTIFICATIONS_TOPIC, (msg) => {
    try {
      const invitation: InvitationDto = JSON.parse(msg.body); 
      callback(invitation);
    } catch (err) {
      console.error("Error parsing invitation:", err, msg);
    }
  });

  return unsubscribe;
};
