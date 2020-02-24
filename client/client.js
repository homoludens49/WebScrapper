const API_URL = 'http://localhost:3000/search/columbus/'

const app = new Vue({
    el: "#app",
    data: {
        term: '',
        loading: false,
        activeTerm: null,
        terms:['moog', 'synth', 'keyboard'],
        activeResults: []
        

    },
    methods: {
        addTerm(){
            this.terms.push(this.term)
        },
        setActiveTerm(term){
            this.activeTerm = term;
            this.loading = true;
            const url = `${API_URL}${term}`
            fetch(url)
            .then(res => res.json())
            .then(json => {
                console.log(json)
                this.activeResults = json.results
                setTimeout(()=>{

                }, 3000);
                this.loading = false;
            })
        }
    },
})