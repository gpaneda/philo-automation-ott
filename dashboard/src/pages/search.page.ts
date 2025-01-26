    getElement(elementName: ChannelShowResultsElementNames) {
        const element = this.channelShowResultsElements[elementName];
        if (element) {
            return this.driver.$(element.selector());
        }
        throw new Error(`Element ${elementName} not found`);
    } 