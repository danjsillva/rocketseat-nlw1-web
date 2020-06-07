import React, { useState, useEffect, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { FiArrowLeft } from 'react-icons/fi'

import api from '../config/api'

import logo from '../assets/logo.svg'

import './Register.css'

interface Item {
    id: number;
    name: string;
    image_url: string;
}

interface IBGEUFResponse {
    id: number;
    sigla: string;
    nome: string;
}

interface IBGECityResponse {
    id: number;
    nome: string;
}

const Register = () => {
    const [items, setItems] = useState<Item[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [selectedUf, setSelectedUf] = useState('')
    const [cities, setCities] = useState<string[]>([])
    const [selectedCity, setSelectedCity] = useState('')

    async function getUfs() {
        const response = (await axios.get<IBGEUFResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`)).data
        const data = response.map(uf => uf.sigla)
        
        setUfs(data)
    }

    async function getCitiesByUF(uf: string) {
        const response = (await axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`)).data
        const data = response.map(city => city.nome)

        setCities(data)
    }

    async function getItems() {
        const data = (await api.get(`items`)).data

        setItems(data)
    }

    useEffect(() => {
        getItems()
        getUfs()
    }, [])

    function handleChangeUf(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedUf(event.target.value)
        getCitiesByUF(event.target.value)
    }

    function handleChangeCity(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCity(event.target.value)
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>

                <Link to="/">
                    <FiArrowLeft />
                    Voltar
                </Link>
            </header>

            <form>
                <h1>Cadastro do ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h1>Dados</h1>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input id="name" type="text" name="name" />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input id="email" type="text" name="email" />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input id="whatsapp" type="text" name="whatsapp" />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h1>Endereço</h1>

                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={[-27.2092052, -49.6401092]} zoom={15}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        <Marker position={[-27.2092052, -49.6401092]} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleChangeUf}>
                                <option value="">Selecione uma UF</option>
                                {ufs.length && ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleChangeCity}>
                                <option value="">Selecione uma cidade</option>
                                {cities.length && cities.map(city => (
                                    <option value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h1>Itens de coleta</h1>

                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.length && items.map(item => (
                            <li key={item.id}>
                                <img src="" alt=""/>
                                <span>{item.name}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
    )
}

export default Register