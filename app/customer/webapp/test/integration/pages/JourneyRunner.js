sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"sap/fe/cap/customer/test/integration/pages/PassengerList",
	"sap/fe/cap/customer/test/integration/pages/PassengerObjectPage",
	"sap/fe/cap/customer/test/integration/pages/BookingObjectPage"
], function (JourneyRunner, PassengerList, PassengerObjectPage, BookingObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('sap/fe/cap/customer') + '/test/flp.html#app-preview',
        pages: {
			onThePassengerList: PassengerList,
			onThePassengerObjectPage: PassengerObjectPage,
			onTheBookingObjectPage: BookingObjectPage
        },
        async: true
    });

    return runner;
});

