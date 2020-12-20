import { Controller } from 'egg';
import { createTransport } from 'nodemailer';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.redirect('/public/index.html')
  }

  public async sendmail() {
    const { ctx } = this;
    const { user, password, title, content, addresses } = ctx.request.body

    const options = {
      service: 'gmail',
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: user,
        pass: password,
      },
    };
    const transporter = createTransport(options);

    const info = await transporter.sendMail({
      from: user, 
      bcc: addresses, //为了让其他人看不到收件人列表，全部密送
      subject: title, 
      text: content, 
    });
  
    ctx.body = info;
  }
}
