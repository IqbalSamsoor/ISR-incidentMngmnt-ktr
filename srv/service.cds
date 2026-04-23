using {sap.capire.incidents as my} from '../db/schema';

/**
 * Service used by support personell, i.e. the incidents' 'processors'.
 */
service ProcessorService {
    entity Incidents as projection on my.Incidents;

    @readonly
    entity Customers as projection on my.Customers;
}

annotate ProcessorService.Incidents with @odata.draft.enabled;
annotate ProcessorService with @(requires: 'support');


/**
 * Service used by administrators to manage customers and incidents.
 */
service AdminService {
    entity Customers as projection on my.Customers;
    entity Incidents as projection on my.Incidents;
}
annotate AdminService with @(requires: 'admin');

// adding new restrictions on user types for practice purpose

// // only admin can update incidents
// annotate ProcessorService.Incidents with @(restrict: [
//   { grant: 'READ', to: 'support' },
//   { grant: 'UPDATE', to: 'admin' }
// ]);

// // only admin can delete incidents
// annotate ProcessorService.Incidents with @(restrict: [
//   { grant: 'DELETE', to: 'admin' }
// ]);

