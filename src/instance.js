let currentInstance = null

function setInstance(instance) {
    currentInstance = instance
}

function getInstance() {
    return currentInstance
}

export { setInstance, getInstance }