Vue.component('company-branch', {
  template: '#branch-template',
  props: {
    branch: Branch
  },

  data: function() {
    return {
      selectedInternetLine: '',
      internetPackages: internetPackages,
      selectedPerson: '',
      peoplePositions: people
    }
  },

  created: function() {
    company.$on('month', this.payExpenses)
    company.$on('year', this.adjustToInflation)
    this.payCreationFees()
  },

  beforeDestroy: function() {
    company.$off('month', this.payExpenses)
    company.$off('year', this.adjustToInflation)
  },

  methods: {
    payCreationFees: function() {
      var rent = this.branch.rent
      var insurance = rent * company.rentInsuranceMonths
      var fees = rent + insurance
      company.ledger.add(new Transaction('New branch', -1 * fees))
    },
    newInternet: function() {
      this.branch.internet.push(this.selectedInternetLine)
    },
    newPerson: function() {
      this.branch.people.push(this.selectedPerson)
    },
    payExpenses: function() {
      company.ledger.add(new Transaction('Branch expenses', -1 * this.branch.expenses()))
    },
    adjustToInflation: function() {
      this.branch.rent = Math.floor(this.branch.rent * (1 + company.inflation))
      message('info', `Branch rent increased to ${this.branch.rent} (${company.inflation * 100}%) to adjust for inflation`)
    }
  }
})

var Branch = class {
  constructor() {
    this.rent = 5000
    this.people = []
    this.kilowattPrice = 0.60
    this.waterLiterPrice = 0.60
    this.internet = []
  }

  expenses() {
    return this.rent + this.electricityBill() + this.waterBill()
  }

  electricityBill() {
    return this.people.length * 100 * this.kilowattPrice
  }

  waterBill() {
    return this.people.length * 100 * this.waterLiterPrice
  }
}
