class AppointmentFactory {

    Build(simplesAppointment){

        const day = simplesAppointment.date.getDate()+1;
        const month = simplesAppointment.date.getMonth();
        const year = simplesAppointment.date.getFullYear();

        const hour = simplesAppointment.time.split(":")[0];
        const minutes = simplesAppointment.time.split(":")[1];

        const startDate = new Date(year, month, day, hour, minutes, 0, 0);
        
        const appo = {
            id: simplesAppointment._id,
            title: simplesAppointment.name + " - " + simplesAppointment.description,
            start: startDate,
            end: startDate,
            notified: simplesAppointment.notified,
            email: simplesAppointment.email
        }

        return appo;
    }

}

module.exports = new AppointmentFactory();