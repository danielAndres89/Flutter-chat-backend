
const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({

    nombre:{
        type:String,
        requiered:true
    },
    email:{
        type:String,
        requiered:true,
        unique:true 
    },
    password:{
        type:String,
        requiered:true
    },
    online:{
        type:Boolean,
        default:false
    }

});

UsuarioSchema.method('toJSON',function(){
    const {__v,_id,password,...object}=this.toObject();
     object.uid = _id;
     return object; 
})

module.exports = model('Usuario',UsuarioSchema);
