<template>
  <template v-if="!editor">
    <h3>Vínculos</h3>
    <div class="ui list">
      <a class="item" v-for="link in obj.links"
         href="{{ link.address }}">
        <i class="world icon"></i>
        <div class="content">
          <div class="header">{{ link.title }}</div>
          <div class="description">{{ link.address | shorten }}</div>
        </div>
      </a>
    </div>
  </template>
  <template v-else>
    <h3>Vínculos</h3>
    <div class="ui list">
      <a class="item" v-for="(index, link) in obj.links"
         @click.prevent="deleteLink(index)">
        <i class="remove circle icon"></i>
        <div class="content">
          <div class="header">{{ link.title }}</div>
          <div class="description">{{ link.address | shorten }}</div>
        </div>
      </a>
    </div>
    <div class="ui form">
      <div class="field">
        <label>Título</label>
        <input type="text" placeholder="Nombre del recurso"
               v-model="newLink.title">
      </div>
      <div class="field">
        <label>Dirección</label>
        <div class="ui left icon input">
          <input type="text" placeholder="http://www.example.org/..."
                 v-model="newLink.address">
          <i class="world icon"></i>
        </div>
      </div>
      <button class="ui button" @click.prevent="addLink">Agregar Nuevo</button>
    </div>
  </template>
</template>

<script lang="babel">
import { shortenURL } from '../lib/utils'

export default {
  props: {
    obj: {
      type: Object,
      twoWay: true,
      required: true
    },
    editor: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newLink: {
        title: "",
        address: ""
      }
    }
  },
  methods: {
    addLink() {
      if (this.newLink.title != "" && this.newLink.address != ""){
        this.obj.links.push({title: this.newLink.title, address: this.newLink.address})
        this.newLink.title = ""
        this.newLink.address = ""
      }
    },
    deleteLink(index) {
      this.obj.links.splice(index, 1)
    }
  },
  filters: {
    shorten: shortenURL
  }
}
</script>
