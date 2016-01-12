<template>
  <div class="ui middle aligned center aligned grid">
    <div class="row">
      <div class="column">
        <h1 class="ui icon header">
          <i class="circular sitemap icon"></i>
          <div class="content">
            XSIGA
            <div class="sub header">
              Elige una categoría
            </div>
          </div>
        </h1>
      </div>
    </div>
    <div class="row">
      <div class="column">
        <div class="ui horizontal link list">
          <a class="item" v-link="{name: 'list', params: {kind: 'course'}}">
            <i class="cube icon"></i> Asignaturas
          </a>
          <a class="item" v-link="{name: 'list', params: {kind: 'teacher'}}">
            <i class="user icon"></i> Profesores
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
