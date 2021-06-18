interface IAnimState {
    className: Map<string, string>
    delay: Map<string, number>
}
export default class AnimState implements IAnimState {
    public delay = new Map<string, number>();
    public className = new Map<string, string>();

    static Default () : Array<AnimState> {
        const first = new AnimState()
        first.delay.set('svg', 0.2)
        first.delay.set('title', 0.2)
        first.delay.set('desc', 0.6)
        first.delay.set('input', 1.0)
        first.delay.set('submit', 1.4)
        first.className.set('svg', 'fadeInDown500ms')
        first.className.set('title', 'fadeInUp500ms')
        first.className.set('desc', 'fadeInUp500ms')
        first.className.set('input', 'fadeInUp500ms')
        first.className.set('submit', 'fadeInUp500ms')

        const second = new AnimState()
        second.delay.set('svg', 1.4)
        second.delay.set('title', 1.0)
        second.delay.set('desc', 0.6)
        second.delay.set('input', 0.2)
        second.delay.set('submit', 0)
        second.className.set('svg', 'fadeOutUp500ms')
        second.className.set('title', 'fadeOutUp500ms')
        second.className.set('desc', 'fadeOutUp500ms')
        second.className.set('input', 'fadeOutUp500ms')
        second.className.set('submit', 'fadeOutUp500ms')

        const third = new AnimState()
        third.delay.set('svg', 0)
        third.delay.set('title', 0)
        third.delay.set('desc', 0)
        third.delay.set('input', 0)
        third.delay.set('submit', 0)
        third.className.set('svg', '')
        third.className.set('title', '')
        third.className.set('desc', '')
        third.className.set('input', '')
        third.className.set('submit', '')

        const four = new AnimState()
        four.delay = third.delay
        four.className.set('svg', '')
        four.className.set('title', '')
        four.className.set('desc', '')
        four.className.set('input', 'headShake500ms')
        four.className.set('submit', 'headShake500ms')

        const five = new AnimState()
        five.delay = four.delay
        five.className.set('svg', '')
        five.className.set('title', '')
        five.className.set('desc', '')
        five.className.set('input', 'shakeX500ms')
        five.className.set('submit', 'shakeX500ms')

        return [first, second, third, four, five]
    }
}
