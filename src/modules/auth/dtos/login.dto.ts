export class LoginInfoDTO {
    readonly name: string
    readonly email: string
    readonly lastLogin: Date;
    readonly enroll: number
    readonly access_token: string;
    readonly refresh_token: string;
}
