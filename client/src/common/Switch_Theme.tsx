
export function ChangeTheme(e: React.MouseEvent) {

    const container = document.getElementById('container');
    const title = document.getElementById('homepage_main_title');
    // const button = document.getElementById('switch');
    // const to modify and add animation to the switch button later
    
    if (container?.getAttribute('data-theme') === 'light') {
        container.removeAttribute('data-theme');

        if(title) {
            title.textContent = "Trivia in the dark";
        }

    } else {
        container?.setAttribute('data-theme', 'light');
        if (title) {
            title.textContent = "Light up your mind";
        }
    }
}