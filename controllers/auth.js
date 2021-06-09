const { response } = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async(req, res = response) => {
    const { email, password } = req.body;

    try {
        //comprobar si existe ya el correo
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: "El correo ya eta registrado",
            });
        }

        const usuario = new Usuario(req.body);

        //encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //Generar mi JWT
        const token = await generarJWT(usuario.id);

        await usuario.save();

        res.json({
            ok: true,
            usuario,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};

const login = async(req, res = response) => {
    const { email, password } = req.body;

    try {
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: "Email no encontrado",
            });
        }

        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: "La contraseña no es valida",
            });
        }

        //generar jwt
        const token = await generarJWT(usuarioDB.id);

        return res.json({
            ok: true,
            usuario: usuarioDB,
            token: token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};

const renewToken = async(req, res = response) => {

    //obtener el uid desde la peticion
    const uid = req.uid;

    //generar un nuevo jwt
    const token = await generarJWT(uid);

    //obtener el usuario por uid
    const usuario = await Usuario.findById(uid);


    res.json({
        ok: true,
        usuario,
        token,
    });

};

module.exports = {
    crearUsuario,
    login,
    renewToken
};