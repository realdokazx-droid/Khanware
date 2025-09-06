plppdo.on('domChanged', () => {
    const pfpElement = document.querySelector('.avatar-pic');
    const nicknameElement = document.querySelector('.user-deets.editable h2');
    const desiredUsername = featureConfigs.customUsername || user.nickname;
    if (nicknameElement && nicknameElement.textContent !== desiredUsername) nicknameElement.textContent = desiredUsername;
    if (featureConfigs.customPfp && pfpElement) { if (pfpElement.src !== featureConfigs.customPfp) { Object.assign(pfpElement, { src: featureConfigs.customPfp, alt: "Not an image URL" }); pfpElement.style.borderRadius = "50%"; }}
});