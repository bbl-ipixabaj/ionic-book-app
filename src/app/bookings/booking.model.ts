export class Booking {
    constructor(
        public id: string,
        public placeId: string,
        public publicUserId: string,
        public placeTitle: string,
        public guestNumber: number,
    ) {

    }
}