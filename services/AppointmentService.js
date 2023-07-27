const appointment = require("../models/Appointment");
const mongoose = require("mongoose");
const AppointmentFactory = require("../factories/AppointmentFactory");
const mailer = require("nodemailer");

const Appo = mongoose.model("Appointment", appointment);

class AppointmentService {

    async create(name, email, description, cpf, date, time) {
        const newAppo = new Appo({
            name,
            email,
            description,
            cpf,
            date,
            time,
            finished: false,
            notified: false
        });

        try {
            await newAppo.save();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async GetAll(showFinished) {

        if (showFinished) { // Pega todas as consultas, finalizadas ou não
            return await Appo.find();
        } else {
            const appos = await Appo.find({ 'finished': false }); // Pega as consultas em aberto
            const appointments = [];

            appos.forEach(appointment => {
                if (appointment.date != undefined) {
                    appointments.push(AppointmentFactory.Build(appointment));
                }
            });

            return appointments;
        }
    }

    async GetById(id) {
        try {
            const event = await Appo.findOne({ '_id': id });
            return event;
        } catch (error) {
            console.log(error);
        }
    }

    async Finish(id) {
        try {
            await Appo.findByIdAndUpdate(id, {finished: true});
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // Query => E-mail
    // Query => CPF
    async Search(query){
        try {  
            const appos = await Appo.find().or([{email: query},{cpf: query}]);
            return appos;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async SendNotification(){
        const appos = await this.GetAll(false);

        const transporter = mailer.createTransport({
            host: "sandbox.smtp.mailtrap.io" ,
            port: 2525,
            auth: {
                user: "youruser",
                pass: "yourpass"
            }
         });

        appos.forEach(async app => {
            const date = app.start.getTime();
            const hour = 1000 * 60 * 60;
            const gap = date - Date.now();

            if(gap <= hour){
                if(!app.notified){
                    await Appo.findByIdAndUpdate(app.id,{notified: true});

                    transporter.sendMail({
                        from: "Huriel Becker <email@email.com.br>",
                        to: app.email,
                        subject: "Sua consulta vai acontecer em breve!",
                        text: "Conteúdo qualquer!!!!! Sua consulta vai acontecer em 1h"
                    }).then( () => {

                    }).catch(err => {
                        console.log(err);
                    })
                }
            }
        });
    }
}

module.exports = new AppointmentService();