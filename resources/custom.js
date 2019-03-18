var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    candidates: null,
    provinces: null,
    districts: null,
    matchedDistricts: null,
    districtNos: null,
    parties: null,
    selectedProvince: '',
    selectedDistrictNo: '',
    selectedParty: '',
    candidate: null
  },
  mounted () {
    axios.all([
        axios.get('candidates2562.min.json'),
        axios.get('districts2562.min.json')
      ])
      .then(axios.spread((candidatesRes, districtsRes) => {
        this.candidates = candidatesRes.data;
        this.provinces = _.uniq(_.map(this.candidates, 'province'));
        this.districts = districtsRes.data;
      }))
      .catch(error => console.log(error));
  },
  methods: {
    getDistrictNos: function (event) {
      this.districtNos = null;
      this.matchedDistricts = null;
      this.districtNos = _.uniq(_.map(_.filter(this.candidates, ['province', event.target.value]), 'district_no'));
      this.matchedDistricts = _.filter(this.districts, ['province', event.target.value]).sort((a, b) => a.district_name.localeCompare(b.district_name));
      this.parties = null;
      this.candidate = null;
    },
    getParties: function (event) {
      $('#districtModal').modal('hide');
      this.selectedDistrictNo = event.target.value;
      this.parties = _.map(_.filter(this.candidates, { 'province': this.selectedProvince, 'district_no': parseInt(event.target.value) }), 'party').sort((a, b) => a.localeCompare(b));
      this.candidate = null;
    },
    getCandidate: function (event) {
      this.candidate = _.find(this.candidates, { 'province': this.selectedProvince, 'district_no': parseInt(this.selectedDistrictNo), 'party': event.target.value })
    }
  }
})