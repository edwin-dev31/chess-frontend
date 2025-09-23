export interface Subscription {
    subscribe(): () => void;
}
