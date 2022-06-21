//Form Validation
var HaliSaha = HaliSaha || {};
HaliSaha.Module = (function () {
    const emailMask = (element) => {
        let config = element;
        config.inputmask({
            mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
            greedy: false,
            onBeforePaste: function (pastedValue, opts) {
                pastedValue = pastedValue.toLowerCase();
                return pastedValue.replace("mailto:", "");
            },
            definitions: {
                "*": {
                    validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~-]",
                    casing: "lower",
                },
            },
        });
    };
    const phoneMask = (element) => {
        let $phone = element;
        $phone.inputmask({
            mask: "999 999 99 99",
            greedy: false,
            clearIncomplete: true,
            removeMaskOnSubmit: true,
        });

        $phone.on("keyup", function (e) {
            var deger = e.currentTarget.value;
            var status = deger.startsWith("5");
            if (!status) {
                $(this).val("");
            }
        });

        $phone.on("countrychange", function (e, countryData) {
            $(this).val("");
            $(this).inputmask({
                mask: $(this).attr("placeholder").replace(/[0-9]/g, "9"),
                greedy: false,
                clearIncomplete: true,
            });
        });
    };
    
  const intlElement = function (config) {
    window.intlTelInput(config, {
      allowDropdown: false,
      preferredCountries: ["tr"],
      utilsScript: "/assets/js/vendor/intl/js/utils.js",
    });
  };
    const dateTimeElement = (element) => {
        element.daterangepicker({
                singleDatePicker: true,
                showDropdowns: true,
                placeholder: "Doğum Tarihiniz",
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
            function (start, end, label) {
                var years = moment().diff(start, "years");
            }
        );
        element.val("");
        element.attr("placeholder", element.attr("placeholder"));
    };

    //filter

    const filterSelection = (filter) => {
        var x, i;

        x = document.getElementsByClassName("filterDiv");
        if (filter == "all") filter = "";

        for (i = 0; i < x.length; i++) {
            HaliSaha.Module.filterRemoveClass(x[i], "show");
            if (x[i].className.indexOf(filter) > -1)
                HaliSaha.Module.filterAddClass(x[i], "show");
        }
 
    };
    const filterSelectionChild = (filter) => {
        var x, i;

        x = document.getElementsByClassName("filterDivChild");
        if (filter == "all") filter = "";

        for (i = 0; i < x.length; i++) {
            HaliSaha.Module.filterRemoveClass(x[i], "show");
            if (x[i].className.indexOf(filter) > -1)
                HaliSaha.Module.filterAddClass(x[i], "show");
        }
    };
    const filterAddClass = (element, name) => {
        var i, arr1, arr2;
        arr1 = element.className.split(" ");
        arr2 = name.split(" ");
        for (i = 0; i < arr2.length; i++) {
            if (arr1.indexOf(arr2[i]) == -1) {
                element.className += " " + arr2[i];
            }
        }
    };
    const filterRemoveClass = (element, name) => {
        var i, arr1, arr2;
        arr1 = element.className.split(" ");
        arr2 = name.split(" ");

        for (i = 0; i < arr2.length; i++) {
            while (arr1.indexOf(arr2[i]) > -1) {
                arr1.splice(arr1.indexOf(arr2[i]), 1);
            }
        }
        element.className = arr1.join(" ");
    };
    const filterButton = (element) => {
        element.on("click", function (e) {
            var element = $(this);
            var filter = element.attr("filter");
            var otherSelectElement = element
                .parents(".filter-scroll")
                .find(".button--filter-m");
            otherSelectElement.removeClass("button--filter-m");
            otherSelectElement.addClass("button--filter-f");
            element.removeClass("button--filter-f");
            element.addClass("button--filter-m");
            HaliSaha.Module.filterSelection(filter);
        });
    };
    const owlFilterSlider = (filterContainer) => {
        filterContainer.owlCarousel({
            navigation: false,
            margin: 30,
            loop: false,
            dots: false,
            slideSpeed: 300,
            autoWidth: true,
            responsiveClass: true,
            responsive: {
                0: {
                    items: 3,
                    nav: false,
                },
                320: {
                    items: 2.2,
                    nav: false,
                },
                370: {
                    items: 2.2,
                    nav: false,
                },
                400: {
                    items: 2.5,
                    nav: false,
                },
                440: {
                    items: 2.8,
                    nav: false,
                },
                480: {
                    items: 3.6,
                    nav: false,
                },
                560: {
                    items: 3.3,
                    nav: false,
                },
                768: {
                    items: 4.3,
                    nav: false,
                },
                992: {
                    items: 4.3,
                    nav: false,
                },
                1200: {
                    items: 5,
                    nav: false,
                },
                1300: {
                    items: 6,
                    nav: false,
                },
                1520: {
                    items: 8,
                    nav: false,
                    autoWidth: true,
                    stagePadding: 20,
                },
                1600: {
                    items: 8,
                    nav: false,
                    autoWidth: true,
                    stagePadding: 20,
                },
            },
        });
    };

    return {
        emailMask,
        phoneMask,
        dateTimeElement,
        owlFilterSlider,
        filterButton,
        filterAddClass,
        filterRemoveClass,
        filterSelection,
    };
})();



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