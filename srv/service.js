// const cds = require('@sap/cds')

// class ProcessorService extends cds.ApplicationService {
//   /** Registering custom event handlers */
//   init() {
//     this.before("UPDATE", "Incidents", (req) => this.onUpdate(req));
//     this.before("CREATE", "Incidents", (req) => this.changeUrgencyDueToSubject(req.data));

//     return super.init();
//   }

//   changeUrgencyDueToSubject(data) {
//     let urgent = data.title?.match(/urgent/i)
//     if (urgent) data.urgency_code = 'H'
//   }

//   /** Custom Validation */
//   async onUpdate (req) {
//     let closed = await SELECT.one(1) .from (req.subject) .where `status.code = 'C'`
//     if (closed) req.reject `Can't modify a closed incident!`
//   }
// }
// module.exports = { ProcessorService }



const cds = require('@sap/cds')

class ProcessorService extends cds.ApplicationService {

  /** Registering custom event handlers */
  init() {

    // this is update check logic, it runs before updating incident
    this.before("UPDATE", "Incidents", (req) => this.onUpdate(req))

    // this runs when new incident is created, it check title for urgency
    this.before("CREATE", "Incidents", (req) =>
      this.changeUrgencyDueToSubject(req.data)
    )

    // this is new rule, it check how many open incidents customer have
    // if too many then block creating new one
    this.before("CREATE", "Incidents", (req) =>
      this.checkCustomerIncidentLimit(req)
    )

    return super.init()
  }

  // ================================
  // existing logic, dont change this
  // ================================

  // check title, if it have urgent word then set urgency high
  changeUrgencyDueToSubject(data) {
    let urgent = data.title?.match(/urgent/i)
    if (urgent) data.urgency_code = 'H'
  }

  // this is update validation, it stop update if incident is closed
  async onUpdate(req) {
    let closed = await SELECT.one(1)
      .from(req.subject)
      .where`status.code = 'C'`

    // if incident already closed then user cant change it
    if (closed) req.reject(`Can't modify a closed incident!`)
  }

  // ================================
  // new business rule i added
  // ================================

  // check how many open incidents customer already have
  // if more then limit then block new creation
  async checkCustomerIncidentLimit(req) {
    const customerId = req.data.customer_ID

    // count all not closed incidents for this customer
    const [{ count }] = await SELECT
      .from('sap.capire.incidents.Incidents')
      .columns('count(*) as count')
      .where({
        customer_ID: customerId,
        status_code: { '!=': 'C' }
      })

    // if customer already have 3 or more open incidents then stop
    if (count >= 3) {
      req.reject(
        400,
        "Customer have too many open incidents, please close some first"
      )
    }
  }
}

module.exports = { ProcessorService }