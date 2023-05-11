import { params } from '../../utils/params';

AFRAME.registerComponent('group', {
  schema: {
    colour_by: { type: 'number', default: params.colour_by },
  },

    init: function () {
      this.group = new THREE.Group();
      this.el.object3D.add(this.group);
      for (let i = 0; i < this.el.children.length; i++) {
        this.group.add(this.el.children[i].object3D);
      }
    },
    update: function(){

      for (let i = 0; i < this.el.children.length; i++) {
        let id = this.el.children[i].id
        this.el.children[i].setAttribute(id,{
          colour_by:this.data.colour_by
        })
      }

    }
  });