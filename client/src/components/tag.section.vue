<template>
  <template v-if="!editor">
    <h3>Etiquetas</h3>
    <div class="ui labels">
      <div class="ui label" v-for="tag in obj.tags">{{ tag }}</div>
    </div>
  </template>
  <template id="tags" v-else>
    <h3>Etiquetas</h3>
    <input type="text" id="inputTags" v-model="tags"/>
    <div class="ui info message">
      <p>Usa la coma o presiona "Enter" para crear un nuevo tag.</p>
    </div>
  </template>
</template>

<script lang="babel">
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
  computed: {
    tags: {
      get: function(){
        return this.obj.tags.join(',')
      },
      set: function(value){
        if(value.trim().length > 0)
          this.obj.tags = value.split(',')
        else this.obj.tags = []
      }
    }
  },
}
</script>
