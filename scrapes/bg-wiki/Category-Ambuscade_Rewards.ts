import * as $ from 'jquery';

function getListings(headElement: string) {

    $(headElement).each(listingHandler);
}

function listingHandler(index: number, element: HTMLElement) {
    let record = new Record();
    let $element = $(element);
    let tables = $element.parent().next().children().children();
    let $sets: ArmorItem[] = [];

    // Set Title
    record.title = $element.text().trim();

    // Add classes
    $(tables).first().find('.mw-redirect').each(function (index, element) {
        record.classes.push($(element).text().trim());
    });

    // Add Item Sets
    $(tables).last().find('div.tab-content')
        .each(function (index, element) {
            let armorSet = new ArmorSet();
            armorSet.title = record.getSetTitle(index);

            $(element).find('table tr:not(:first-child):not(:has(>td[colspan]))')
                .each(function (index, element) {
                    let armor = new ArmorItem();
                    let $cells = $(element).children().not('.img-scaler').not(':has(>img)');

                    armor.name = $($cells[0]).find('a').first().text().trim();
                    armor.slot = $($cells[1]).text().trim();
                    armor.parseStats($($cells[2]).text().trim());

                    armorSet.items.push(armor);
                });

            record.sets.push(armorSet);
        });

    records.push(record);
}

class Record {
    public title: string = '';
    public classes: string[] = [];
    public sets: ArmorSet[] = [];

    constructor() {

    }

    public getSetTitle = (index: number): string => {
        let title = this.title.substring(0, this.title.length - 1);
        if (index > 0) {
            return `${title} +${index}`;
        }
        return title;
    }
}

class ArmorSet {
    public title: string = '';
    public items: ArmorItem[] = [];
}

class ArmorItem {
    public name: string = '';
    public slot: string = '';
    public stats: Stat[] = [];

    public parseStats(rawStats: string): void {
        const regex = /(?:(DEF|[a-zA-Z": %.\d]*)[ ]?\:?([\+\-]?[\d]*\%?)[ ]?)/g;

        let m;
        while ((m = regex.exec(rawStats)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            if(m[1].trim().length > 0) {
                this.stats.push(new Stat(m[1].trim(), m[2].trim()))
            }
        }

    }
}

class Stat {
    constructor(
        public name: string,
        public value: string
    ) { }
}

/* ***************************************** */
let records: Record[] = [];

getListings('h4 .mw-headline');

localStorage.setItem("bg-wiki/Category:Ambuscade_Rewards", JSON.stringify(records))
