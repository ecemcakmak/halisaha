const menuIcon = document.querySelector('.header__hamburger');
const navbar = document.querySelector('.header__navbar');

// menuIcon.addEventListener('click', () => {
//     navbar.classList.toggle("header__hamburger__motion");
// });


const dateTimeElement = (element) => {
    element.daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            placeholder: "Tarih Seçiniz",
            minYear: 1881,
            locale: {
                format: "DD/MM/YYYY",
                separator: " - ",
                applyLabel: "Uygula",
                cancelLabel: "Vazgeç",
                fromLabel: "Dan",
                toLabel: "a",
                customRangeLabel: "Seç",
                daysOfWeek: ["Pz", "Pt", "Sl", "Çr", "Pr", "Cm", "Ct"],
                monthNames: [
                    "Ocak",
                    "Şubat",
                    "Mart",
                    "Nisan",
                    "Mayıs",
                    "Haziran",
                    "Temmuz",
                    "Ağustos",
                    "Eylül",
                    "Ekim",
                    "Kasım",
                    "Aralık",
                ],
                firstDay: 1,
            },
            maxYear: parseInt(moment().format("YYYY"), 10),
        },
        function(start, end, label) {
            var years = moment().diff(start, "years");
        }
    );
    element.val("");
    element.attr("placeholder", element.attr("placeholder"));
};
const dateFormat = (date) => {
    return new Date(date).toLocaleDateString();
};