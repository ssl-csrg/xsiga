<template>
  <img :src="source"
       height="{{ size }}"
       width="{{ size }}"
       class="vue-gravatar {{ class }}"
       :style="style"></img>
</template>

<script lang="babel">
import md5 from 'md5'
import querystring from 'querystring'
import isRetina from 'is-retina'
export default {
  props: {
    email: { type: String },
    md5: { type: String },
    size: { type: Number, default: 50 },
    rating: { type: String, default: 'g' },
    https: { type: Boolean, default: false },
    class: { type: String, default: "" },
    default: { type: String, default: "retro" }
  },
  computed: {
    source(){
      let baseURL = this.https ? "https://secure.gravatar.com/avatar/" : 'http://www.gravatar.com/avatar/'
      let query = querystring.stringify({
        s: isRetina ? this.size * 2 : this.size,
        r: this.rating,
        d: this.default
      })

      let hash = this.md5 ? this.md5 : this.email ? md5(this.email) : false
      if(!hash){
        console.warn('you need to provide either email or md5 hash to retrieve the gravatar')
        return ""
      }

      return baseURL + hash + '?' + query
    }
  }
}
</script>
