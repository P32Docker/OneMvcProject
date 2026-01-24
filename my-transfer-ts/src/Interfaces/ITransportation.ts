export interface ITransportation {
    id:number;
    code: string;
    fromCityName: string;
    fromCountryName: string;
    toCityName: string;
    toCountryName: string;
    departureTime: string;
    arrivalTime: string;
    seatsTotal: number;
    seatsAvailable: number;
    statusName: string;
}