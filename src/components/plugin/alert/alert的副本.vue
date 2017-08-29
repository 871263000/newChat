/**
 * Vue Plugin Install.
 */

function install(Vue) {

    var AlertConstructor = Vue.extend(require('./alert.vue'));
    var alertInstance = null;

    Object.defineProperty(Vue.prototype, '$alert', {

        get: function () {

            return (message, position) => {
                if (alertInstance) return;
                alertInstance = new AlertConstructor({
                    el: document.createElement('div'),
                    data() {
                        return {
                            message: message,
                            position: position
                        };
                    },
                    created () {
                        setTimeout(() => {
                            alertInstance.$destroy();
                            alertInstance.$el.remove();
                        }, 2000);
                    }
                });
                document.body.appendChild(alertInstance.$el);
            };
        }

    });

    // Vue.transition('fadeIn', {
    //     afterEnter: function (el) {
    //         
    //     },
    //     afterLeave: function (el) {
    //         alertInstance = null;
    //     }
    // });
}

if (window.Vue) {
    Vue.use(install);
}

module.exports = install;
