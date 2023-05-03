<template>
  <div class="sect">
      <Form class="border" msg="Register" v-bind:waiting-list="waitingList" v-bind:refercode="refer" @update-data="getWaitingList" style="padding: 10px;" />
  </div>
  <div class="sect">
      <Queue class="border" msg="Waiting List" v-bind:waiting-list="waitingList" style="padding: 10px;" />
  </div>
</template>

<script setup>
  import Form from './components/Form.vue'
  import Queue from './components/Queue.vue'
  import { supabase } from './supabase'
</script>

<script>
  export default {
    data() {
      return {
        waitingList: [],
        refer: null
      };
    },
    methods: {
      getWaitingList: async function(){
        var data = await supabase.from('WAITINGLIST').select().order('order', { ascending: true });;
        this.waitingList = data.data;
        return data.data;
      }
    },
    mounted(){
      this.getWaitingList();
      console.log(window);
      const params = new URLSearchParams(window.location.search);
      this.refer = params.get("refer");
      console.log(this.refer);
      
    },
  }

</script>


<style scoped>

.border{
  border: 2px solid black;
  border-radius: 7px;
}

.sect{
  padding: 10px;
}

</style>
