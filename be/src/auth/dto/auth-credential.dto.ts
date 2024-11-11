import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialDto {
  @IsString()
  @IsNotEmpty()
  @IsUnique()
  id: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'password only accepts english and number',
  })
  pw: string;

  @IsString()
  name: string;

  @IsString()
  year: string;
}
function IsUnique(): (target: AuthCredentialDto, propertyKey: 'id') => void {
  return (target: AuthCredentialDto, propertyKey: 'id') => {
    console.log(target, propertyKey);
  };
}
