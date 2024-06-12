const views = ["#homepage"]


function switchView(newView) {
    for (let view of views) {
        if (view != newView) $(view).hide()
    }
    $(newView).show()
}

switchView("#homepage")
