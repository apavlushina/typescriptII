import { IsString } from "class-validator";
import {
  JsonController,
  Body,
  Post,
  BadRequestError
} from "routing-controllers";
import User from "../users/entity";
import { sign } from "../jwt";

class AuthenticatePayload {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

@JsonController()
export default class LoginController {
  @Post("/logins")
  async authenticate(@Body() { email, password }: AuthenticatePayload) {
    const user = await User.findOne({ where: { email } });
    if (!user)
      throw new BadRequestError("A user with this email does not exist");
    // if password is correct
    // send back a jwt token
    // else: send some HTTP 400 Bad request error
    if (!(await user.checkPassword(password))) {
      console.log("BCD");
      throw new BadRequestError("The password is not correct");
    }

    const jwt = sign({ id: user.id! });
    return { jwt };
  }
}

//     return User.merge(user, update).save();
//   }

//   @Post("/users")
//   async createUser(@Body() user: User) {
//     const { password, ...rest } = user;
//     const entity = User.create(rest);
//     await entity.setPassword(password);
//     return entity.save();
//   }
