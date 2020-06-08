import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

import api from '../config/api'

import logo from '../assets/logo.svg'

import './Items.css'

interface Item {
    id: number;
    name: string;
    image_url: string;
}

const Items = () => {
    const [items, setItems] = useState<Item[]>([])
    const [formData, setFormData] = useState({ name: '', image_url: '' })

    const history = useHistory()

    useEffect(() => {
        getItems()
    }, [])

    async function getItems() {
        const data = (await api.get(`items`)).data

        setItems(data)
    }

    function handleChangeInput(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target

        setFormData({ ...formData, [name]: value })
    }

    async function handleSubmitForm(event: FormEvent) {
        event.preventDefault()

        const data = {
            name: formData.name,
            image_url: formData.image_url,
        }

        const response = (await api.post(`items`, data)).data

        alert('Sucesso! Item criado.')

        history.push('/')
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

            <form onSubmit={handleSubmitForm}>
                <h1>Cadastro de itens</h1>

                <fieldset>
                    <legend>
                        <h1>Dados</h1>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome do item</label>
                        <input id="name" type="text" name="name" value={formData.name} onChange={handleChangeInput} />
                    </div>

                    <div className="field">
                        <label htmlFor="image_url">Imagem</label>
                        <input id="image_url" type="text" name="image_url" value={formData.image_url} onChange={handleChangeInput} />
                    </div>
                </fieldset>

                <button type="submit">
                    Cadastrar item
                </button>

                <fieldset>
                    <legend>
                        <h1>Itens de coleta</h1>

                        <span>Itens cadastrados</span>
                    </legend>

                    <ul className="items-grid">
                        {items.length && items.map(item => (
                            <li key={item.id}>
                                <img src={item.image_url} alt={item.name} width={100} />
                                <span>{item.name}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>
            </form>
        </div>
    )
}

export default Items