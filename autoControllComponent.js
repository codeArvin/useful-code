/**
 * @Author: hanliu.shao <codearvin>
 * @Date:   2018-08-30 12:28:49
 * @Email:  codearvin@gmail.com
 * @Filename: autoControllComponent.js
 * @Last modified by:   codearvin
 * @Last modified time: 2018-08-30 12:30:34
 */


import shallowCompare from 'react-addons-shallow-compare';

const noop = () => {};

const optimizer = (
    Component,
    key = 'value',
    internalKey = `_${key}`
) => {
    // 后面要绑定this，所以这里不能用箭头函数
    // 这里其实是浅比较，真正应用的时候应该用浅比较还是深比较
    // 因为在这里已经使用了shouldComponentUpdate，如果用户不自己写的话，有可能造成其他参数变了但组件并不会更新
    function shallowCompareWithExcept(nextProps, nextState) {
        // const props = {
        //     ...nextProps,
        //     [key]: this.props[key] // 这里为什么要把[key]的值更新成旧的？
        //                            // 因为在shouldComponentUpdate中已经分情况判断过props[key]和state[key]了
        //                            // 所以在这里只需要判断props/state中其他属性是否有更新就可以了
        //                            // 这里发现个问题就是如果是非受控组件，props中是没有value的，我们不需要添加一个，
        //                            // 不然会导致结果出错
        // };
        const props = this.props[key] ? ({ ...nextProps, [key]: this.props[key] }) : ({ ...nextProps });

        const state = {
            ...nextState,
            [internalKey]: this.state[internalKey]
        };
        return shallowCompare(this, props, state);
    }

    const {
        shouldComponentUpdate = shallowCompareWithExcept,
        componentWillReceiveProps = noop
    } = Component.prototype;

    Object.defineProperty(Component.prototype, 'displayValue', {
        get: function getDisplayValue() {
            return this.props[key] !== undefined ? this.props[key] : this.state[internalKey];
        }
    })

    Object.defineProperty(Component.prototype, 'componentWillReceiveProps', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: function componentWillReceivePropsWrapped(nextProps) {
            const { value: controledValue } = nextProps;
            if (nextProps[key] !== undefined && nextProps[key] !== this.state[internalKey]) {
                this.setState({
                    [internalKey]: this.mapPropToState ? this.mapPropToState(controledValue) : controledValue
                });
            }
            componentWillReceiveProps.call(this, nextProps);
        }
    });

    Object.defineProperty(Component.prototype, 'shouldComponentUpdate', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: function shouldComponentUpdateWrapped(nextProps, nextState) {
            let result = true;
            if (nextProps[key] !== undefined) {
                // controled
                result = nextProps[key] !== this.props[key];
            } else {
                // uncontroled
                result = nextState[internalKey] !== this.state[internalKey];
            }
            return result || shouldComponentUpdate.call(this, nextProps, nextState);
        }
    });

    return Component;
}

// 两种使用方式
// 1. @hybridCtrl: 这时key、internalKey默认都是vlaue
// 2. @hybridCtrl(key, internalKey): 这时自定义key、internalKey

export const hybridCtrl = (keyOrComp, internalKey) => {
    if (typeof keyOrComp === 'function') {
        return optimizer(keyOrComp);
    }

    return (Component) => optimizer(Component, keyOrComp, internalKey);
}


@hybridCtrl
class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            _value: ''
        }
    }

    static propTypes = {
        value: PropTypes.any
    }

    mapPropToState(controledValue) {
        // you can do some transformations from `props.value` to `state.value`
    }

    handleChange(newValue) {
        // it's your duty to handle change events and dispatch `props.onChange`
    }

}
