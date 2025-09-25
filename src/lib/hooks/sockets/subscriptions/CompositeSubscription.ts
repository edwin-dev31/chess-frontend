import { Subscription } from './Subscription';

export class CompositeSubscription implements Subscription {
    private subscriptions: Subscription[];

    constructor(subscriptions: (Subscription | null)[]) {
        this.subscriptions = subscriptions.filter(sub => sub !== null) as Subscription[];
    }

    subscribe(): () => void {
        const unsubscribes = this.subscriptions.map(sub => sub.subscribe()).filter(unsub => unsub);

        return () => {
            unsubscribes.forEach(unsub => unsub());
        };
    }
}
