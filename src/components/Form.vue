<template>
    <div>
        <div class="Form">
        <h2 class="green">{{ msg }}</h2><br />
        <form id="myForm" @submit.prevent="onSubmit()" style="margin-left : 25%; margin-right: 25%;">
            <label for="email">Email</label>
            <div style="width: 100%;">
                <input type="email" id="email" name="email" v-model="email" size="30" required>
            </div>
            <label for="refer">Referral Code</label>
            <div style="width: 100%;">
                <input type="text" id="refer" name="refer" v-model="refer" size="30"><br><br>
            </div>
            <input id="submit" type="submit" value="Submit">
        </form>
        </div>
        <br/>
        <div v-show="show">
            <p>Your email {{ email }} is already registered</p>
            <p>Your referal code: {{ newReferCode }}</p>
            <p>Your referal link: <a v-bind:href="newReferLink">{{newReferLink}}</a></p>
        </div>
    </div>
</template>


<script>
import { supabase } from '../supabase';

    // import { axios } from "axios";
    
    export default {
        props: ['msg', 'updateData', 'refercode'],
        data() {
            return {
                email: "",
                refer: null,
                newReferCode: "",
                newReferLink: "",
                show: false,
                url: "https://soft-torte-6f19a2.netlify.app/?refer="
            };
        },
        methods: {
            onSubmit: async function() {
                //check email exist 
                var existEmail = await supabase.from('USER').select().eq('email', this.email);
                if(existEmail.data.length > 0){
                    this.newReferCode = existEmail.data[0].referral_code;
                    this.newReferLink = this.url + this.newReferCode
                    this.show = true;
                }
                else{
                    var referUserExist = 0;
                    console.log(this.refer)
                    if(this.refer){
                        console.log('refer: ' + this.refer);
                        var referUser = await supabase.from('USER').select().eq('referral_code', this.refer);
                        console.log(referUser.data)
                        if(referUser.data.length > 0){
                            referUserExist = 1;
                            console.log(this.email, this.refer);
                            this.newReferCode = this.generateCode(6);
                            this.newReferLink = this.url + this.newReferCode
                            var createUser = await supabase.from('USER').insert({
                                email: this.email,
                                referral_code: this.newReferCode,
                                created_at: new Date().toISOString()
                            }).select();
                            console.log('create User');
                            console.log(createUser);
                            if(createUser.status == 201){
                                //number of waitinglist
                                var order = await supabase.from('WAITINGLIST').select();
                                console.log(order);

                                //create data in WAITINGLIST table
                                var createWaitingList = await supabase.from('WAITINGLIST').insert({
                                    email: this.email,
                                    order: order.data.length + 1
                                });
                                console.log(createWaitingList);
                                if(referUserExist == 1){
                                    console.log('refer: ' + this.refer);
                                    var referUser = await supabase.from('USER').select().eq('referral_code', this.refer);
                                    console.log(referUser);

                                    //get current order
                                    var orderReferUser = await supabase.from('WAITINGLIST').select().eq('email', referUser.data[0].email);
                                    console.log(orderReferUser);

                                    if(orderReferUser.data[0].order != 1){
                                        //get upper user 
                                        var upUsers = await supabase.from('WAITINGLIST').select()
                                            .order('order', { ascending: true });
                                        console.log(upUsers);
                                        var upUser = upUsers.data.filter(function (el) {
                                            console.log(el);
                                            console.log(orderReferUser.data[0].order - 1);
                                            if(el.order == orderReferUser.data[0].order - 1)
                                                return el;
                                        });
                                        console.log(upUser);
                                        const upUserEmail = upUser[0].email;
                                        const upUserOrder = orderReferUser.data[0].order;
                                        const referUserEmail = referUser.data[0].email;
                                        const referUserOrder = orderReferUser.data[0].order - 1;

                                        const { referUserData, referUserError } = await supabase
                                                .from('WAITINGLIST')
                                                .update({ order: referUserOrder })
                                                .eq('email', referUserEmail)
                                                .select();
                                        console.log('update refer user');
                                        console.log(referUserData);
                                        console.log(referUserError);

                                        const { upUserData, upUserError } = await supabase
                                                .from('WAITINGLIST')
                                                .update({ order: upUserOrder })
                                                .eq('email', upUserEmail)
                                                .select();
                                        console.log('update Up user');
                                        console.log(upUserData);
                                        console.log(upUserError);
                                    }

                                    
                                }


                                this.$emit('updateData');
                                this.show = true;
                                alert('Your email successfully been registered!');
                            }
                            else{
                                var error = createUser.error;
                                if(error.code == "23505"){
                                    var user = await supabase.from('USER').select().eq('email', this.email);
                                    console.log(user);
                                    this.newReferCode = user.data[0].referral_code;
                                    this.newReferLink = this.url + this.newReferCode
                                    this.show = true;
                                    // alert("User already on queue");
                                }else{
                                    alert(error.message);
                                }
                            }
                        }else {
                            alert('Referral code not found.')
                        }
                    }
                    else{
                        console.log(this.email, this.refer);
                        this.newReferCode = this.generateCode(6);
                        this.newReferLink = this.url + this.newReferCode
                        var createUser = await supabase.from('USER').insert({
                            email: this.email,
                            referral_code: this.newReferCode,
                            created_at: new Date().toISOString()
                        }).select();
                        console.log('create User');
                        console.log(createUser);
                        if(createUser.status == 201){
                            //number of waitinglist
                            var order = await supabase.from('WAITINGLIST').select();
                            console.log(order);

                            //create data in WAITINGLIST table
                            var createWaitingList = await supabase.from('WAITINGLIST').insert({
                                email: this.email,
                                order: order.data.length + 1
                            });
                            console.log(createWaitingList);
                            if(referUserExist == 1){
                                console.log('refer: ' + this.refer);
                                var referUser = await supabase.from('USER').select().eq('referral_code', this.refer);
                                console.log(referUser);

                                //get current order
                                var orderReferUser = await supabase.from('WAITINGLIST').select().eq('email', referUser.data[0].email);
                                console.log(orderReferUser);

                                if(orderReferUser.data[0].order != 1){
                                    //get upper user 
                                    var upUsers = await supabase.from('WAITINGLIST').select()
                                        .order('order', { ascending: true });
                                    console.log(upUsers);
                                    var upUser = upUsers.data.filter(function (el) {
                                        console.log(el);
                                        console.log(orderReferUser.data[0].order - 1);
                                        if(el.order == orderReferUser.data[0].order - 1)
                                            return el;
                                    });
                                    console.log(upUser);
                                    const upUserEmail = upUser[0].email;
                                    const upUserOrder = orderReferUser.data[0].order;
                                    const referUserEmail = referUser.data[0].email;
                                    const referUserOrder = orderReferUser.data[0].order - 1;

                                    const { referUserData, referUserError } = await supabase
                                            .from('WAITINGLIST')
                                            .update({ order: referUserOrder })
                                            .eq('email', referUserEmail)
                                            .select();
                                    console.log('update refer user');
                                    console.log(referUserData);
                                    console.log(referUserError);

                                    const { upUserData, upUserError } = await supabase
                                            .from('WAITINGLIST')
                                            .update({ order: upUserOrder })
                                            .eq('email', upUserEmail)
                                            .select();
                                    console.log('update Up user');
                                    console.log(upUserData);
                                    console.log(upUserError);
                                }

                                
                            }


                            this.$emit('updateData');
                            this.show = true;
                            alert('Your email successfully been registered!');
                        }
                        else{
                            var error = createUser.error;
                            if(error.code == "23505"){
                                var user = await supabase.from('USER').select().eq('email', this.email);
                                console.log(user);
                                this.newReferCode = user.data[0].referral_code;
                                this.newReferLink = this.url + this.newReferCode
                                this.show = true;
                                // alert("User already on queue");
                            }else{
                                alert(error.message);
                            }
                        }
                    }
                }

                return this.email;


            },
            
            generateCode: function(length) {
                let result = '';
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                const charactersLength = characters.length;
                let counter = 0;
                while (counter < length) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                counter += 1;
                }
                return result;
            }
        },
        watch: {
            email: function(newVal, oldVal){
                if(newVal != oldVal)
                    this.show = false;
            },
            refercode: function(newVal, oldVal){
                this.refer = newVal
            }
        }
    };
</script>

<style>
    #submit {
        float: right;
        margin-left: 25%; 
        margin-right: 15%;
        
    }

</style>