<template>
    <div>
        <h2 class="green">{{ msg }}</h2><br/>
        <table class="center">
            <tr>
                <th class="center" span="1" style="width: 15%;">No</th>
                <th span="1" style="width: 55%;">Email</th>
            </tr>
            <tr v-for="waiting in waitingList">
                <td style="text-align: center;">{{ waiting.order }}</td>
                <td>{{ waiting.email }}</td>
            </tr>
        </table>
    </div>
</template>


<script>
    import { supabase } from '../supabase'
    export default {
        props: ['msg', 'waitingList'],
        data() {
            return {
            };
        },
        methods: {
            getData: async function(){
                var list = await supabase.from('WAITINGLIST').select();
                console.log(list.data);
                this.$emit('waitingList', list.data);
            }
        },
        mounted: async function() {
        }
    };

</script>

<style>

table, th, td {
  border: 2px solid black;
  border-collapse: collapse;
  margin-bottom: 30px;;
}

.center{
    margin-left: auto;
    margin-right: auto;
}
</style>