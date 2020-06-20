<template>
  <div v-if="catalogList.length" class="catalog">
    <div class="catalogTitle">{{ title }}</div>
    <div ref="catalogBody" class="catalogBody" :style="computedStyle">
      <div ref="catalogList" class="catalogList">
        <div
          ref="catalogItem"
          v-for="(item, index) in catalogList"
          :key="index"
          :class="['catalogItem', { active: index === activeAnchorIndex }, item.className]"
          @click="selectItem(item)"
        >
          <i></i>
          <span>{{ item.innerText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const isScrollElement = el => ['scroll', 'auto'].includes(window.getComputedStyle(el).overflowY)
import { throttle } from 'lodash'

export default {
  props: {
    content: {
      required: true,
    },
    levels: {
      type: Array,
      default: () => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    distance: {
      default: 40,
      type: Number,
    },
    delay: {
      default: 200,
      type: Number,
    },
    scrollBehavior: {
      default: 'smooth',
      validator: val => ['auto', 'smooth'].includes(val),
    },
    maxHeight: {
      default: null,
      type: String,
    },
    title: {
      default: '目录',
      type: String,
    }
  },
  data () {
    return {
      catalogList: [],
      activeAnchorIndex: 0,
    }
  },
  computed: {
    contentWrapperElement () {
      return document.querySelector(this.content)
    },
    offsetParent () {
      const contentWrapperElement = this.contentWrapperElement
      return (contentWrapperElement && isScrollElement(contentWrapperElement)) ? contentWrapperElement
        : window
    },
    computedStyle () {
      const style = {}
      if (this.maxHeight) {
        Object.assign(style, {
          maxHeight: this.maxHeight,
          overflowY: 'auto',
        })
      }
      return style
    },
  },
  watch: {
    activeAnchorIndex (index) {
      const catalogItems = this.$refs.catalogItem
      if (catalogItems) {
        const activeAnchor = catalogItems[index]
        const catalogBody = this.$refs.catalogBody
        if (activeAnchor.offsetTop > catalogBody.clientHeight / 2 && this.maxHeight) {
          this.$refs.catalogList.style.transform = `translateY(${catalogBody.clientHeight / 2 - activeAnchor.offsetTop}px)`
        } else {
          this.$refs.catalogList.style.transform = null
        }
      }
    },
  },
  mounted () {
    this.getTagList()
    this.setActiveCatalogItem()
    this.offsetParent.addEventListener('scroll', throttle(this.setActiveCatalogItem, this.delay))
    this.$once('hook:beforeDestroy', () => {
      this.offsetParent.removeEventListener('scroll', this.setActiveCatalogItem)
    })
  },
  methods: {
    selectItem (item) {
      window.scrollTo({
        top: item.offsetTop - this.distance,
        behavior: this.scrollBehavior,
      })
    },
    getTagList () {
      let id = 0;
      if (!this.contentWrapperElement) return
      const children = this.contentWrapperElement.querySelectorAll(`*`)
      children.forEach(child => {
        const tagName = child.tagName.toLowerCase()
        const index = this.levels.findIndex(item => item === tagName)
        if (index >= 0) {
          child.id = ++id
          child.className = 'lv' + (index + 1)
          this.catalogList.push(child)
        }
      })
    },
    setActiveCatalogItem () {
      const offsetParentScrollTop = this.offsetParent === window ? document.documentElement.scrollTop
        : this.offsetParent.scrollTop
      const reverseList = [...this.catalogList].reverse()
      let matchedIndex = reverseList.findIndex(item => offsetParentScrollTop + this.distance >= item.offsetTop)
      if (matchedIndex === -1) {
        matchedIndex = this.catalogList.length - 1
      }
      this.activeAnchorIndex = this.catalogList.length - matchedIndex - 1
    },
  }
}
</script>

<style lang="scss">
@for $i from 2 through 6 {
  .catalogItem.lv#{$i} {
    padding-left: $i * 14px - 7px;
    font-size: 14px;
  }
}

.catalogItem.lv1 {
  padding-left: 5px;
  font-size: 16px;
}

.catalog {
  .catalogTitle {
    margin-top: 10px;
    line-height: 25px;
    font-size: 18px;
    font-weight: 600;
  }

  .catalogBody {
    position: relative;

    &::before {
      content: '';
      width: 2px;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 7px;
      background-color: #ebedef;
      opacity: 0.5;
    }
  }

  .catalogItem {
    position: relative;
    padding-top: 3px;
    padding-bottom: 3px;
    cursor: pointer;

    i {
      display: inline-block;
      width: 4px;
      height: 4px;
      vertical-align: middle;
      background-color: currentColor;
      border-radius: 50%;
    }

    &.lv1 {
      i {
        width: 6px;
        height: 6px;
      }
    }

    &.active {
      color: #007fff;
      background-color: #ebedef;
    }

    &:hover {
      background-color: #ebedef;
    }

    &.lv1 {
      font-weight: 600;
    }
  }
}
</style>
