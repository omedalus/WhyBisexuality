/**
 * Created by Paul Bogdan on 7/25/2017.
 */


 function Attribute(boolean, index){
     this.boolean = boolean;
     this.index = index;

    this.getIndex = function (){
         return this.index;
     }

     this.mutate = function (){
         this.boolean = !this.boolean;
     }

     this.getBoolean = function (){
         return this.boolean;
     }

 }