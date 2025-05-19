

export default function ChangeTheme() {

    const container = document.getElementById('container');
    // const button = document.getElementById('switch');
    // const to modify and add animation to the switch button later
    
    if (container?.getAttribute('data-theme') === 'light') {
        container.removeAttribute('data-theme');
    } else {
        container?.setAttribute('data-theme', 'light');
    }

}