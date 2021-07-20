const MysqlDBService = require('../common/service/mysqldbservice.js');
const nodemailer = require("nodemailer");

class DueDateReminderJob extends MysqlDBService{
    constructor() {
        super();
    }

    async pickTaskAlreadyDue() {
        try {
            const todoUserList = await this.executeQuery(`SELECT tl.id, GROUP_CONCAT(DISTINCT t.title) AS taskTitle, GROUP_CONCAT(DISTINCT u.email) AS userEmailList              
                FROM task t                  
                    INNER JOIN todolist tl on t.todoListId = tl.id                  
                    INNER JOIN user_todolist utl on tl.id = utl.todoListId              
                    INNER JOIN user u ON (u.id = utl.senderId OR u.id = utl.receipientId) 
                WHERE TIMESTAMPDIFF(SECOND, dueDateTime, now()) > 0             
                GROUP BY tl.id, t.id;`);
            
            todoUserList?.length && todoUserList.forEach(item => {
                this.sendEmail({
                    to: item.userEmailList,
                    subject: item.taskTitle
                });
            });
            console.log('All done. Exiting');
            process.exit();
        } catch(err) {
            console.log(err);process.exit();
        }
    }

    async sendEmail({to, subject}) {
        console.log(`Sending email to ${to} for title ${subject}`);
        try {
            let testAccount = await nodemailer.createTestAccount();

            let transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                }
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: 'progress@customercare.com', 
                to, 
                subject, 
                text: `Hello 
                    Your Task is due. Please take action.

                Thanks
                - Progress`,
            });
            console.log(info);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        } catch(err) {
            console.log(err);process.exit();
        }
    };
}

const obj = new DueDateReminderJob();
obj.pickTaskAlreadyDue();